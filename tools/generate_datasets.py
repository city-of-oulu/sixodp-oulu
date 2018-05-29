#!/usr/bin/env python
#

"""
This generates deterministically random datasets for random organizations as bulk process
"""

import sys
import ckanapi
import datetime
import argparse
import random
import re

def name_generator():
    words = [x.strip() for x in open('/usr/share/dict/words', 'r') if re.match('^[A-Za-z]*$', x)]
    while True:
        yield "-".join([random.choice(words) for i in range(3)]).lower()

def create_dataset(api, name, title, license_id, notes, organization_name, keywords, date_released, geographical_coverage, maintainer_email):
    print("Creating dataset %s for organization %s" % (name, organization_name))
    api.action.package_create(**{
        "name": name,
        "title_translated": {"fi": title},
        "license_id": license_id,
        "notes_translated": {"fi": notes},
        "owner_org": organization_name,
        "keywords": {"fi": keywords},
        "date_released": date_released,
        "geographical_coverage": geographical_coverage,
        "maintainer_email": maintainer_email
    })

def main():
    parser = argparse.ArgumentParser(description="Generates CKAN datasets")
    parser.add_argument("-b", "--base", default="http://localhost:5000",
                        help="Base URL for CKAN API to post to [default: '%(default)s']")
    parser.add_argument("-a", "--apikey", default="tester",
                        help="API key to post with [default: '%(default)s']")
    parser.add_argument("num_datasets", metavar="N", type=int,
                        help="Number of datasets")
    args = parser.parse_args()

    user_agent_ident = "generate_orgs-{:%Y%m%d%H%M%S%f}".format(datetime.datetime.utcnow())

    api = ckanapi.RemoteCKAN(args.base,
                             apikey=args.apikey,
                             user_agent='avoindata_ckanapi_organize_orgs/1.0 ({0})'.format(user_agent_ident))

    num_datasets = args.num_datasets

    random.seed(num_datasets)
    names = name_generator()
    organizations = api.action.organization_list()

    for index in range(num_datasets):
        organization_name = random.choice(organizations)
        name = next(names)
        title = name.replace('-', ' ')
        license_id = "cc-by-4.0"
        notes = name * 5
        keywords = ["generated word", "another keyword"]
        date_released = datetime.datetime.now().isoformat()
        geographical_coverage = "generated city"
        maintainer_email = "generated@example.com"

        create_dataset(api, name, title, license_id, notes, organization_name, keywords, date_released, geographical_coverage, maintainer_email)


if __name__ == '__main__':
    main()